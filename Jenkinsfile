pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/suhani241004/capstone-labs.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                bat 'cd client && npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'cd client && npm run build'
            }
        }

    }
}