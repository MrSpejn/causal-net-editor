export const JSONGraph = {
    "nodes": [
        {
            "id": 0,
            "name": "Start",
            "additional_info": {},
            "outgoing": [
                [1, 2],
                [3, 4],
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
                [3],
                [4],
                [5],
            ],
            "incomming": [
                [0, 2],
                [0, 4, 5],
                [3, 5],
            ]
        },
        {
            "id": 2,
            "name": "Action B",
            "additional_info": {},
            "outgoing": [
                [1],
                [3],
                [4],
                [5],
            ],
            "incomming": [
                [0],
                [1],
                [3],
                [4],
            ]
            
        },
        {
            "id": 3,
            "name": "Action C",
            "additional_info": {},
            "outgoing": [
                [1],
                [2],
                [4],
                [5],
            ],
            "incomming": [
                [0],
                [1],
                [2],
                [4],
            ]
        },
        {
            "id": 4,
            "name": "Action D",
            "additional_info": {},
            "outgoing": [
                [1],
                [3],
                [2],
                [5],
            ],
            "incomming": [
                [0],
                [1],
                [3],
                [2],
            ]
        },
        {
            "id": 5,
            "name": "End",
            "additional_info": {},
            "outgoing": [],
            "incomming": [
                [0, 2],
                [1, 3],
                [0, 1, 4],
                [2],
            ]
        },
        // {
        //     "id": 6,
        //     "name": "a",
        //     "additional_info": {},
        //     "outgoing": [
        //         [1, 2],
              
        //     ],
        //     "incomming": [
        //         [0]
        //     ]
        // },
    ]
  }

  export default JSONGraph;