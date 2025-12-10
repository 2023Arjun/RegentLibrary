pipeline {
    agent any

    stages {
        // 1. Get the code from GitHub
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // 2. Run Tests for BOTH Apps at the same time
        stage('Install & Test Microservices') {
            parallel {
                
                // --- BRANCH A: Main Django App ---
                stage('Main Backend') {
                    steps {
                        script {
                            echo "Setting up Main Backend..."
                            // Create isolated environment for Django
                            sh 'python3 -m venv venv_main'
                            
                            // Install Django dependencies
                            sh '. venv_main/bin/activate && pip install -r djangotutorial/requirements.txt'
                            
                            // Run Django Tests
                            echo "Running Backend Tests..."
                            sh '. venv_main/bin/activate && python manage.py test my_database'
                        }
                    }
                }

                // --- BRANCH B: Notification Microservice ---
                stage('Notification Service') {
                    steps {
                        script {
                            echo "Setting up Notification Service..."
                            // Create isolated environment for Microservice
                            sh 'python3 -m venv venv_notify'
                            
                            // Install Flask dependencies
                            sh '. venv_notify/bin/activate && pip install -r notification-service/requirements.txt'
                            
                            // Run Microservice Tests
                            echo "Running Notification Service Tests..."
                            sh '. venv_notify/bin/activate && python notification-service/tests.py'
                        }
                    }
                }
            }
        }

        // 3. Deploy (Placeholder)
        stage('Deploy') {
            steps {
                script {
                    echo "Tests passed for Monolith and Microservices."
                    echo "Ready to deploy..."
                    // Add deployment commands here
                }
            }
        }
    }
}