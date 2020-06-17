export const JSONGraph = {
    "nodes": [
        {
            "id": 0,
            "name": "Start",
            "additional_info": {},
            "outgoing": [
                [1, 3],
                [1],
                [4, 5],
            ],
            "incomming": []
        },
        {
            "id": 1,
            "name": "Action A",
            "additional_info": {},
            "outgoing": [
                [2],
                [0],
            ],
            "incomming": [
                [0],
                [2],
            ]
        },
        {
            "id": 2,
            "name": "Action B",
            "additional_info": {},
            "outgoing": [
                [4],
                [1],
                [5],
            ],
            "incomming": [
                [1, 3]
            ]
            
        },
        {
            "id": 3,
            "name": "Action C",
            "additional_info": {},
            "outgoing": [
                [2],
                [5],
            ],
            "incomming": [[0]]
        },
        {
            "id": 4,
            "name": "Action D",
            "additional_info": {},
            "outgoing": [
                [5]
            ],
            "incomming": [
                [2]
            ]
            
        },
        {
            "id": 5,
            "name": "End",
            "additional_info": {},
            "outgoing": [],
            "incomming": [[2], [4]]
        }
    ]
  }

  export default JSONGraph;