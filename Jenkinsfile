pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Frontend') {
            steps {
                dir('client') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    bat 'npm run build'
                }
            }
        }
    }
}