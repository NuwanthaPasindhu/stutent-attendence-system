
# Student-Attendance-Marker

![Student-Attendance-Marker](https://dl.dropboxusercontent.com/s/ui08l4x0hnzoq8a/cf753b3e41634cafb24b149bf779ca31-0001.jpg?dl=0)

Student Attendance Marking System This web application can mark daily student attendance.

## This system has three main roles.
- Administrator 
- Section head 
- Teacher

Admin can create a section head account using section, email.
Also, the admin can upload all teacher and student data using bulky

Using this data, the system automatically creates a user account, automatically assigns that user to the class and sends an email to the user with an email and temporary password.

Similarly, Heads of Sections can set up the account of teachers in their section as above

Teachers can add their class student list. Or students can be assigned to the class.Teachers can then mark student attendance by scanning the QR code

On the teacher dashboard they can view the student attendance history

In the section head dashboard they can view their section daily student attendance along with total student attendance

In the Principal dashboard also, the Principal can view the daily attendance of all the school students and he can view section wise student attendance

## Database diagram
![DB-diagram](https://dl.dropbox.com/scl/fi/1ibq51fkdlatsjrhmql94/Student-Attendance-Marking-app.png?rlkey=6wekwn43we42v8upcuuvj0fgl&st=vhf9zuja&dl=0)

## Technologies and Packages Used

- Vue js 
- Node js

### How to run the code

- `Git` from here: `https://git-scm.com/downloads`. If you already installed, skip this step.
- `Node js` from here: `https://nodejs.org/en/`. If you already installed, skip this step.

- Clone this repository by running below command or downloading the zip file for the code.
```sh
https://github.com/NuwanthaPasindhu/stutent-attendence-system
```
- Change directory to the frontend folder
```sh
cd Student-Attendance-system/client
```
- Install the necessary dependencies.
```sh
npm install
```

- Change directory to the server folder
```sh
cd Student-Attendance-system/server
```
- Install the necessary dependencies.
```sh
npm install 
```
- update .env file with your DB Cridentials
```sh
MONGO_DB_URL = 

MAIL_PORT = 
MAIL_HOST = 
MAIL_USERNAME = 
MAIL_PASSWORD = 
MAIL_FROM_ADDRESS = 

JWT_SECRET = 

```

- start  server

```sh
npm run serve
```

- DB config
Need to upload JSON files in the data folder to mongo DB
    - rootUser.json -  Root User Data 
    - section.json  - School section Data
    - sectionClass.json - School Classes Data
     

- Root Userauthentication Cridentials
 ```sh
 Email - admin@admin.com
 Password - 12345678
 ```

## Authors

- [@NuwanthaPasindhu](https://www.github.com/https://github.com/NuwanthaPasindhu)


## License

[MIT License](https://choosealicense.com/licenses/mit/)
