pipeline {
<<<<<<< HEAD

=======
>>>>>>> om
    agent any

    stages {

        stage('Checkout') {
            steps {
<<<<<<< HEAD
                echo 'Checking out Student Management System...'
=======
>>>>>>> om
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
<<<<<<< HEAD
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
=======
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
>>>>>>> om
            }
        }
    }

    post {
<<<<<<< HEAD

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
=======
        success {
            echo 'Jenkins CI Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage.'
        }
    }
}
>>>>>>> om
