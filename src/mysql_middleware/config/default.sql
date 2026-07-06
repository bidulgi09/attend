CREATE TABLE "students" (
    "id" varchar(8) NOT NULL,
    "name" varchar(50) NOT NULL,
    "email" varchar(100) NOT NULL,
    "avatar" MEDIUMTEXT NOT NULL,
    "password_hash" varchar(255) DEFAULT NULL,
    "role" varchar(100) DEFAULT'Student',
    "log" json DEFAULT(json_array()),
    "status" json DEFAULT(
        cast(
            _utf8mb4 '{ "attendence":0, "lateness": 0, "absence": 0, "earlyLeave": 0 }' as json
        )
    ),
    "refresh_token" varchar(100) DEFAULT NULL,
    "expired_in" varchar(100) DEFAULT NULL,
    PRIMARY KEY ("id"),
    UNIQUE KEY "email" ("email")
);

CREATE TABLE "teachers" (
    "id" varchar(8) NOT NULL,
    "name" varchar(50) NOT NULL,
    "email" varchar(100) NOT NULL,
    "password_hash" varchar(255) DEFAULT NULL,
    "role" varchar(255) DEFAULT 'teacher',
    "grades" json DEFAULT(JSON_ARRAY()),
    "refresh_token" varchar(100) DEFAULT NULL,
    "expired_in" varchar(100) DEFAULT NULL,
    PRIMARY KEY ("id"),
    UNIQUE KEY "email" ("email")
);

CREATE TABLE "subjects" (
    "id" varchar(100) NOT NULL,
    "name" varchar(100) NOT NULL,
    "teacher_id" varchar(8),
    "student_list" json DEFAULT(json_array()),
    PRIMARY KEY ("id")
);