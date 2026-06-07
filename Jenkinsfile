pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "my-backend"
        DOCKER_IMAGE_FRONTEND = "my-frontend"
        SONAR_SERVER_URL = "http://sonarqube:9000"
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
                    // Inject SonarQube configuration from Jenkins settings
                    withSonarQubeEnv('SonarQube') {
                        // Use single quotes for SH to let Linux handle environment variables
                        sh '''docker run --rm \
                            -v "$(pwd):/usr/src" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.projectKey=3-tier-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_SERVER_URL \
                            -Dsonar.token=$SONAR_AUTH_TOKEN'''
                    }
                    
                    // Move the report file so Jenkins can find it for Quality Gate
                    sh 'find . -name report-task.txt -exec cp {} . || true'
                    
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
