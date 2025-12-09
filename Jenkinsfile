pipeline {
    agent any

    environment {
        CI = 'true' 
    }

    stages {
        // --- BACKEND STAGES ---
        stage('Backend: Setup & Install') {
            steps {
                // REMOVED dir('djangotutorial') wrapper here
                
                // Create venv in the root
                sh 'python3 -m venv venv'
                
                // Activate and install (assuming requirements.txt is in the root now)
                sh '. venv/bin/activate && pip install -r requirements.txt'
            }
        }

        stage('Backend: Run Unit Tests') {
            steps {
                script {
                    try {
                        // REMOVED dir('djangotutorial') wrapper here
                        
                        // Run manage.py directly from the root
                        sh '. venv/bin/activate && python manage.py test'
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