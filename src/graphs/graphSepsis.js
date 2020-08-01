export const JSONGraph = {
    "nodes": [
        {
            "id": 0,
            "name": "START",
            "additional_info": {},
            "outgoing": [[1]],
            "incomming": []
        },
        {
            "id": 1,
            "name": "ER Registration",
            "additional_info": {},
            "outgoing": [[2, 3, 4]],
            "incomming": [[0]]
        },
        {
            "id": 2,
            "name": "Leucocytes",
            "additional_info": {},
            "outgoing": [[2], [9]],
            "incomming": [[2], [1]]
        },
        {
            "id": 3,
            "name": "CPR",
            "additional_info": {},
            "outgoing": [[3], [9], [3, 9]],
            "incomming": [[3], [1]]
        },
        {
            "id": 4,
            "name": "ER Triage",
            "additional_info": {},
            "outgoing": [[5]],
            "incomming": [[1]]
        },
        {
            "id": 5,
            "name": "ER Sepsis Triage",
            "additional_info": {},
            "outgoing": [[6]],
            "incomming": [[4]]
        },
        {
            "id": 6,
            "name": "IV Liquid",
            "additional_info": {},
            "outgoing": [[7]],
            "incomming": [[5]]
        },
        {
            "id": 7,
            "name": "IV Antibiotics",
            "additional_info": {},
            "outgoing": [[8]],
            "incomming": [[6]]
        },
        {
            "id": 8,
            "name": "Admission NC",
            "additional_info": {},
            "outgoing": [[8], [9]],
            "incomming": [[8], [7]]
        },
        {
            "id": 9,
            "name": "Release A",
            "additional_info": {},
            "outgoing": [[10], [11]],
            "incomming": [[2, 3, 8]]
        },
        {
            "id": 10,
            "name": "Return ER",
            "additional_info": {},
            "outgoing": [[11]],
            "incomming": [[9]]
        },
        {
            "id": 11,
            "name": "END",
            "additional_info": {},
            "outgoing": [],
            "incomming": [[10], [9]]
        },
    ]
  }

  export default JSONGraph;