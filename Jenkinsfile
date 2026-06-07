pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "my-backend"
        DOCKER_IMAGE_FRONTEND = "my-frontend"
        // Internal URL for the scanner to use
        SONAR_INTERNAL_URL = "http://ubuntu-sonarqube-1:9000"
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
                        // Use the internal network 'ubuntu_default' and internal container name
                        sh '''docker run --rm \
                            --network ubuntu_default \
                            -v "$(pwd):/usr/src" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.projectKey=3-tier-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_INTERNAL_URL \
                            -Dsonar.token=$SONAR_AUTH_TOKEN'''
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
