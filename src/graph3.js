export const JSONGraph = {
    "nodes": [
        {
            "id": 0,
            "name": "Start",
            "additional_info": {},
            "outgoing": [
                [2, 3],
                [1, 2],
                [1, 3],
                [1],
                [2],
                [3],
            ],
            "incomming": []
        },
        {
            "id": 1,
            "name": "Action A",
            "additional_info": {},
            "outgoing": [
                [4],
            ],
            "incomming": [
                [0]
            ]
        },
        {
            "id": 2,
            "name": "Action B",
            "additional_info": {},
            "outgoing": [
                [5],
                [3],
                [5, 3],
            ],
            "incomming": [
                [0]
            ]
            
        },
        {
            "id": 3,
            "name": "Action C",
            "additional_info": {},
            "outgoing": [
                [4],
            ],
            "incomming": [
                [0],
                [2, 0],
            ]
        },
        {
            "id": 4,
            "name": "Action D",
            "additional_info": {},
            "outgoing": [],
            "incomming": [
                [5, 3],
                [1],
                [1, 5],
                [3],
                [1, 3],
                [5],
            ]
        },
        {
            "id": 5,
            "name": "Action B",
            "additional_info": {},
            "outgoing": [
                [4],
            ],
            "incomming": [
                [2]
            ]
            
        },
     
    ]
  }

  export default JSONGraph;