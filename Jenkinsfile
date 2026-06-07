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
                    withSonarQubeEnv('SonarQube') {
                        // Added -Dsonar.sources and fixed path mapping
                        sh "docker run --rm \
                            -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                            -v \"\$(pwd):/usr/src\" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.projectKey=3-tier-app \
                            -Dsonar.sources=. \
                            -Dsonar.token=${SONAR_AUTH_TOKEN}"
                    }
                    
                    // Force Jenkins to find the report file created by Docker
                    sh 'cp .scannerwork/report-task.txt . || true'
                    
                    timeout(time: 1, unit: 'HOURS') {
                        waitForQualityGate abortPipeline: true
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
