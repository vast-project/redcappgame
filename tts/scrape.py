import json

from txt2speech import build

fin = "../static/story/redcapTaleItalian.json"
# fin = "../static/story/redcapTaleEnglish.json"

# voice = "Giovanni"
# voice = "Dorothy"  # en
voice = "Bella"  # it

with open(fin, "r") as inj:
    source = json.load(inj)

for card in source:
    # page
    tin = " ".join([p["text"]["content"] for p in card["pages"] if "text" in p])
    tout = (card["audio"] if "audio" in card else "")[1:]

    if tin and tout:
        print(tin)
        build(tin, voice, tout)
        print(tout)
    else:
        print(f"Failed: in: {tin}; out: {tout}")

    if "feedback" in card:
        for item in card["feedback"]["list"]:
            tin = item["text"]
            tout = item["audio"][1:]

            if tin and tout:
                print(tin)
                build(tin, voice, tout)
                print(tout)
            else:
                print(f"Failed: in: {tin}; out: {tout}")

        # todo audio for "option" Continue

    if "question" in card:
        root = card["question"]
        tin = root["text"]
        tout = root["audio"][0][1:]

        if tin and tout:
            print(tin)
            build(tin, voice, tout)
            print(tout)
        else:
            print(f"Failed: in: {tin}; out: {tout}")

        for i, o in enumerate(root["options"]):
            tin = o
            tout = root["audio"][i + 1][1:]

            if tin and tout:
                print(tin)
                build(tin, voice, tout)
                print(tout)
            else:
                print(f"Failed: in: {tin}; out: {tout}")

    if "choice" in card:
        root = card["choice"]
        tin = root["text"]
        tout = root["audio"][0][1:]

        if tin and tout:
            print(tin)
            build(tin, voice, tout)
            print(tout)
        else:
            print(f"Failed: in: {tin}; out: {tout}")

        for i, o in enumerate(root["options"]):
            tin = o
            tout = root["audio"][i + 1][1:]

            if tin and tout:
                print(tin)
                build(tin, voice, tout)
                print(tout)
            else:
                print(f"Failed: in: {tin}; out: {tout}")
