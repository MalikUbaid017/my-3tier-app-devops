pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "my-backend"
        DOCKER_IMAGE_FRONTEND = "my-frontend"
        SONAR_SCANNER_HOME = tool 'SonarScanner'
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
                    // This assumes SonarQube is configured in Jenkins global settings
                    withSonarQubeEnv('SonarQube') {
                        sh "${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectKey=3-tier-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://13.126.1.153:9000"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker compose build"
            }
        }

        stage('Deploy') {
            steps {
                sh "docker compose up -d"
            }
        }
    }
}
