pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "my-backend"
        DOCKER_IMAGE_FRONTEND = "my-frontend"
        SONAR_URL = "http://localhost:9000"
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
                    withSonarQubeEnv('SonarQube') {
                        // Use the native scanner installed on the host
                        sh "sonar-scanner \
                            -Dsonar.projectKey=3-tier-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.token=${SONAR_AUTH_TOKEN}"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker-compose -p 3tier-app build"
            }
        }

        stage('Deploy') {
            steps {
                sh "docker-compose -p 3tier-app up -d"
            }
        }
    }
}
