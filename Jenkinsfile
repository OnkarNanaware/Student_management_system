pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out Student Management System...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Student Management System...'
                sh 'npm run build'
            }
        }

        stage('Automated Tests') {
            steps {
                echo 'Running automated tests...'
                sh 'npm test'
            }
        }
    }

    post {

        success {
            echo '======================================'
            echo 'PIPELINE SUCCESS'
            echo 'All automated tests passed.'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'PIPELINE FAILED'
            echo 'One or more stages failed.'
            echo '======================================'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
