pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/suhani241004/capstone-labs.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Server') {
            steps {
                bat 'node server.js'
            }
        }
    }
}