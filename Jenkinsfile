pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'python -m pip install -r requirements.txt'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'python -m pytest -v'
            }
        }

        stage('Verify Application') {
            steps {
                bat 'python -c "import app; print(\'Flask application imported successfully\')"'
            }
        }
    }

    post {
        success {
            echo 'Jenkins CI Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage.'
        }
    }
}