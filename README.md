## Virtual-Tour-Panolens

Master's project of an application built on the basis of the Panolens framework, which enables a virtual tour of the AEI faculty of the Silesian University of Technology.

**Demo**

---

**Running App**

To run the application, you must have a local server that runs files from the given directory under *localhost*.
After that, all you need to do is enter the following in your browser:

`http://localhost:<port>/<path_to_app>/index.html>`

**Add new scenes**

1.  Prepare pictures 
    - the default naming is: 
        >p<floor_number>__<scene_number>

        (i.e. *p1_1*)
2.  Complete the dependency map (`/json/map.json`) for the source addresses of the added photos
and parameters of the active elements (position and rotation of next scene):
    ```
    {
        "id": <photo_id>,
        "src": <photo_src>,
        "spots": [
            {
                "id": <next_photo_id>,
                "position": {
                    "x": <positionX>,
                    "y": <positionY>,
                    "z": <positionZ>
                },
                "rotation": 
                {
                    "x": <rotationX>,
                    "y": <rotationY>,
                    "z": <rotationZ>
                }
            },
            ...
        ]
    },
    ...
```