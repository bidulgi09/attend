CREATE TABLE "users" (
    "user_id" bigint NOT NULL AUTO_INCREMENT,
    "username" varchar(50) NOT NULL,
    "email" varchar(100) NOT NULL,
    "password_hash" varchar(255) DEFAULT NULL,
    "nickname" varchar(30) DEFAULT NULL,
    "role" enum('Student', 'Teacher', 'Admin') DEFAULT 'Student',
    "log" json DEFAULT(json_array()),
    "current_status" json DEFAULT(
        cast(
            _utf8mb4 '{ "attendence":0, "lateness": 0, "absence": 0, "earlyLeave": 0 }' as json
        )
    ),
    "is_active" tinyint(1) DEFAULT '1',
    "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
    "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    "refresh_token" varchar(100) DEFAULT NULL,
    "expired_in" varchar(100) DEFAULT NULL,
    PRIMARY KEY ("user_id"),
    UNIQUE KEY "username" ("username"),
    UNIQUE KEY "email" ("email")
)