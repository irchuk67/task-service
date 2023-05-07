db.createUser(
    {
        user: "tasks",
        pwd: "tasks",
        roles: [
            {
                role: "readWrite",
                db: "tasks"
            }
        ]
    }
);