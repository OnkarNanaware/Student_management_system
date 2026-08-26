pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }
        stage('deploy')
        {
            steps{
                echo 'Deploed succesfully on the Docker container...'
            }
        }
    }
}
