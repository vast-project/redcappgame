#!/usr/bin/env python3

from typing import Dict, List, Tuple

import os
import requests
import regex

from pydub import AudioSegment

from secret import eleven_key, deepl_key

voices = {
    "Adam": "pNInz6obpgDQGcFmaJgB",  # "Adam", US
    "Bella": "EXAVITQu4vr4xnSDxMaL",  # US, female, narration
    "Arnold": "VR6AewLTigWG4xSOukaG",  # "Arnold", US
    "Domi": "AZnzlk1XvdvUeBnXmlld",  # "Domi", US
    "Dorothy": "ThT5KcBeYPX3keUQqHPh",  # UK, fairy tale
    "Giovanni": "zcAOhNBS3c14rBihAFp1",  # english-italian
    "Josh": "TxGEqnHWrfWFTfGW9XjX",  # "Josh", US
    "Matthew": "Yko7PKHZNXotIFUBG7I9",  # UK. audiobook
    "Serena": "pMsXgVXv3BLzUgSXRplE",
    "Charlotte": "XB0fDUnXU5powFXDhCwa" # bg
}

# https://github.com/anars/blank-audio
pauses = {
    ",": "250-milliseconds-of-silence",
    ".": "500-milliseconds-of-silence",
    "!": "500-milliseconds-of-silence",
    "\n": "750-milliseconds-of-silence",
}

# dir = "en"
dir = "it"
dir = "bg"

# model = "eleven_multilingual_v1"
model = "eleven_multilingual_v2"

cache: Dict[Tuple[str, str], str] = {}
fname_templ = f"{dir}/{{}}"


def load(fname: str) -> str:
    with open(fname) as f:
        content = f.read()
    return content


def build(s: str, r: str, address: str = "", lang: str = "en") -> str:
    """From https://stackoverflow.com/a/53101953/1827854"""
    # local_filename = f"{address.strip()}-{r.strip()}.mp3"
    if not address:
        address = s
    local_filename = fname_templ.format(address.strip())

    # if (s.strip(), r.strip()) in cache and cache[
    #     (s.strip(), r.strip())
    # ] != local_filename:
    #     shutil.copyfile(cache[(s.strip(), r.strip())], local_filename)
    #     print(f"Copying {cache[(s.strip(),r.strip())]} to {local_filename}")
    #     return local_filename
    # cache[(s.strip(), r.strip())] = local_filename

    if os.path.exists(local_filename):
        print(f"Skipping {local_filename}")
        return local_filename

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voices[r.strip()]}"
    # url = f"https://api.elevenlabs.io/v2/text-to-speech/{voices[r.strip()]}"
    headers = {"xi-api-key": eleven_key}
    body = {
        "text": s.strip(),
        "language_id": lang,
        "model_id": model,
    }
    response = requests.post(url, headers=headers, json=body)
    if response.status_code >= 400:
        print(response.status_code, response.content)

    totalbits = 0
    if response.status_code == 200:
        with open(local_filename, "wb") as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    totalbits += 1024
                    print(f"Downloaded {local_filename} ({totalbits*1025}KB)...")
                    f.write(chunk)

    return local_filename


def parse(text: str) -> List[str]:
    """https://stackoverflow.com/a/51893662/1827854"""
    delimiters = regex.escape("".join(pauses.keys()))
    tokens = regex.split(r"(?<=[{}])(?!$)".format(delimiters), text, flags=regex.V1)
    result = []
    for t in tokens:
        if t[:-1].strip():
            result += [t[:-1].strip()]
        result += [t[-1]]
    return result


def glue(files: List[str], output_name: str) -> str:
    """https://stackoverflow.com/questions/61499350/combine-audio-files-in-python"""
    segments = [AudioSegment.from_file(s, format="mp3") for s in files]
    combined = sum(segments)

    file_handle = combined.export(fname_templ.format(output_name), format="mp3")
    return file_handle


def translate(text: str, to_lang: str) -> str:
    deepl_host = "https://api-free.deepl.com/v2"
    translate_url = f"{deepl_host}/translate"

    # def acceptable(l: int) -> bool:
    #     check_url = f"{deepl_host}/usage"
    #     response = requests.get(check_url, headers={"Authorization": f"DeepL-Auth-Key {deepl_key}"})
    #     cnt = int(response.json()["character_count"])
    #     print(f"Current count: {cnt} + {l}")
    #     return cnt + l < 5000

    # if not acceptable(len(text)):
    # 	return {}
    data = {"auth_key": deepl_key, "text": text, "target_lang": to_lang.upper()}
    response = requests.post(translate_url, data)
    result = response.json()

    if len(result["translations"]) != 1:
        print(result)
    print(result["translations"])
    # print(result["translations"][0]["detected_source_language"])
    # print(result["translations"][0]["text"])
    return result["translations"][0]["text"]


if __name__ == "__main__":
    text = load(f"story.txt")
    print(text)
    files = []
    for token in parse(text):
        if token in pauses:
            files += [fname_templ.format(pauses[token])]
        else:
            files += [build(token, "Dorothy")]
    print(files)
    file_handle = glue(files, "0_story")
    print(f"Written: {file_handle}")

    pass
#    print(build("Buongiorno, ma dove pensi di andare, tu? Stai andando a casa? Bene.", "player", "test2", "it"))
# # with open("game/stories/rootsofgold/story.short.csv") as csvfile:
# with open("game/stories/rootsofgold/story.csv") as csvfile:
#     spamreader = csv.reader(csvfile)
#     title = True
#     present = []
#     for row in spamreader:
#         if title:
#             title = False
#             continue
#         if not row[0] or not row[0].strip():
#             continue
#         print(row)
#         build(row[1], row[2], row[0])
#         build(row[4], "player", f"{row[0]}l")
#         build(row[7], "player", f"{row[0]}r")
