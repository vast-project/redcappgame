from typing import Dict
from collections import namedtuple

from model import Session

import model
from query import queries

from messaging import heads, empties, player_values, counter, total_values


def persist_object(object_name: str, data: Dict[str, str]) -> object:
    """Gets a name and a dict and persists it into an table called User<Name>"""
    obj = getattr(model, f"User{object_name.capitalize()}")()
    for k, v in data.items():
        # try:
        setattr(obj, k, v)
        # except:
        #    # Skip methods
        #    pass
    s = Session()
    s.add(obj)
    s.commit()
    s.refresh(obj)
    s.close()
    print(obj)

    return obj


def run_query(query_name: str, data: Dict[str, str]) -> object:
    # from https://stackoverflow.com/a/22084672/1827854
    s = Session()
    # result = s.execute(get_query(query_name, data))
    result = s.execute(queries[query_name], data)
    s.close()

    # Record = namedtuple("Record", result.keys())
    # r_list = [Record(*r) for r in result.fetchall()]
    r_list = result.mappings().all()
    # col_names = [i[0] for i in result.description]
    # r_list = [dict(zip(col_names, row)) for row in result]
    # r_list = [dict(r.items()) for r in result.fetchall()]
    # for r in result:
    #     print(r)
    #     print(r[0])  # Access by positional index
    #     # print(r['my_column']) # Access by column name as a string
    #     r_list += [dict(r.items())]  # convert to dict keyed by column names

    for r in r_list:
        print(r)
    return r_list


def values2msg(values) -> str:
    if not values:
        return ""
    result = ""
    if len(values) > 1:
        result = ", ".join(
            [f"<strong>{v['response_value']}</strong>" for v in values[:-1]]
        )
        result += " and "
    return result + f"<strong>{values[-1]['response_value']}</strong>"


def generate_debriefing(session_id: str):
    result = run_query("L", {"session_id": session_id})
    if not result:
        return ""
    lang = result.pop()["language"]
    if (
        lang not in player_values
        or lang not in empties
        or lang not in heads
        or lang not in counter
        or lang not in total_values
    ):
        lang = "en"
    own_values = values2msg(run_query("A", {"session_id": session_id}))
    result = run_query("B", {"language": lang})
    if not result:
        return ""
    all_players = result.pop()["count"]
    all_values = values2msg(run_query("C", {"language": lang}))

    body = [player_values[lang].format(own_values)] if own_values else [empties[lang]]
    assert all_players
    result = (
        [heads[lang]] + body + [counter[lang].format(f"<strong>{all_players}</strong>")]
    )
    if all_values:
        result += [total_values[lang].format(all_values)]

    return "<p>" + "</p>\n<p>".join(result) + "</p>"
