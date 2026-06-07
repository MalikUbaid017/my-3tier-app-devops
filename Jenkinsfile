pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "my-backend"
        DOCKER_IMAGE_FRONTEND = "my-frontend"
        SONAR_HOST_URL = "http://13.234.226.173:9000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Static Code Analysis') {
            steps {
                script {
                    // Using Docker to run Sonar Scanner (No tool configuration needed!)
                    withSonarQubeEnv('SonarQube') {
                        sh "docker run --rm \
                            -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                            -e SONAR_SCANNER_OPTS=\"-Dsonar.projectKey=3-tier-app\" \
                            -e SONAR_TOKEN=${SONAR_AUTH_TOKEN} \
                            -v \"\$(pwd):/usr/src\" \
                            sonarsource/sonar-scanner-cli"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker-compose build"
            }
        }

        stage('Deploy') {
            steps {
                sh "docker-compose up -d"
            }
        }
    }
}
