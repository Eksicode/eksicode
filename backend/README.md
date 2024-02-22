## POST CRUD islemleri

# Tum postlari listelemek icin:

    Endpoint : http://127.0.0.1:8000/api/post/

    METHOD : GET

    return :
        "data": [
            {
                "id": 18,
                "title": "this is new new title",
                "path": "http://127.0.0.1:8000/post/this-is-new-new-title",
                "body": "this is title of post",
                "user_id": 1,
                "user": "Jamaal Walker",
                "status": false,
                "tag_id": 1,
                "category_id": 1,
                "category": "ea",
                "created_at": "1 hour ago"
            },
            {
                "id": 10,
                "title": "velit",
                "path": "http://127.0.0.1:8000/post/velit",
                "body": "Nobis et et iure excepturi eos nemo culpa. Esse rerum eaque laudantium sint. Beatae quod aut tempore voluptate eos molestias. Veniam qui id deleniti facere.",
                "user_id": 7,
                "user": "Mr. Wilford Blanda DVM",
                "status": false,
                "tag_id": 5,
                "category_id": 5,
                "category": "quod",
                "created_at": "3 hours ago"
            },

    

# Tek bir postu listelemek icin

    METHOD : GET

    Endpoint : http://127.0.0.1:8000/api/post/{:id}

    {:id} => post id

    return :
        {
            "data": {
                "id": 18,
                "title": "this is new new title",
                "path": "http://127.0.0.1:8000/post/this-is-new-new-title",
                "body": "this is title of post",
                "user_id": 1,
                "user": "Jamaal Walker",
                "status": false,
                "tag_id": 1,
                "category_id": 1,
                "category": "ea",
                "created_at": "43 minutes ago"
            }
        }

# Post Create Etmek icin

    Endpoint : http://127.0.0.1:8000/api/post/

    METHOD : POST

    params :
        {
            "title":"this is title",
            "slug":"this-is-title",
            "post":"this is title of post",
            "user_id":"1",
            "status":"false",
            "comment_id":"1",
            "tag_id":"1",
            "category_id":"1"
        }

# Post Update Etmek icin

    METHOD : PUT

    Endpoint : http://127.0.0.1:8000/api/post/{:id}

    {:id} => post id

    params:
    {
        "title":"this is new new title ",
        "slug":"this-is-new-new-title"
    }

# Post Delete Etmek icin

    METHOD : DELETE

    Endpoint : http://127.0.0.1:8000/api/post/{:id}

    {:id} => post id
