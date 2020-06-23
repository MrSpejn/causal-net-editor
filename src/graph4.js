export const JSONGraph = {
    "nodes": [
        {
            "id": 0,
            "name": "Start",
            "additional_info": {},
            "outgoing": [
                // [2, 3],
                // [1, 2],
                // [1, 3],
                // [1],
                // [2],
                // [3],
            ],
            "incomming": []
        },
        {
            "id": 1,
            "name": "Action A",
            "additional_info": {},
            "outgoing": [
                // [5],
            ],
            "incomming": [
                // [0]
            ]
        },
        {
            "id": 2,
            "name": "Action B",
            "additional_info": {},
            "outgoing": [
                // [5],
            ],
            "incomming": [
                // [0]
            ]
            
        },
        {
            "id": 3,
            "name": "Action C",
            "additional_info": {},
            "outgoing": [
                // [5],
            ],
            "incomming": [
                // [0],
            ]
        },
        {
            "id": 5,
            "name": "Start",
            "additional_info": {},
            "incomming": [
                // [1, 2, 3],
                // [3],
                // [2, 3],
                // [2],
                // [1, 2],
                // [1],
                // [1, 3],
            ],
            "outgoing": []
        },
    ]
  }

  export default JSONGraph;