pipeline {
    agent any

    environment {
        CI = 'true' 
    }

    stages {
        // --- DEBUG STAGE (Optional: Remove later) ---
        stage('Debug: List Files') {
            steps {
                // This prints your folder structure to the logs so we can see where files actually are
                sh 'ls -R'
            }
        }

        // --- BACKEND STAGES ---
        stage('Backend: Setup & Install') {
            steps {
                // Create venv in the root
                sh 'python3 -m venv venv'
                
                // Activate and install pointing to the SUBFOLDER file
                sh '. venv/bin/activate && pip install -r djangotutorial/requirements.txt'
            }
        }

        stage('Backend: Run Unit Tests') {
            steps {
                script {
                    try {
                        // Run manage.py pointing to the SUBFOLDER file
                        sh '. venv/bin/activate && python djangotutorial/manage.py test'
                    } catch (err) {
                        echo 'Backend tests failed!'
                        throw err
                    }
                }
            }
        }

        // --- FRONTEND STAGES ---
        stage('Frontend: Install Dependencies') {
            steps {
                dir('library-frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend: Build & Test') {
            steps {
                dir('library-frontend') {
                    sh 'npm test -- --passWithNoTests'
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build Passed!'
        }
        failure {
            echo 'Build Failed.'
        }
    }
}