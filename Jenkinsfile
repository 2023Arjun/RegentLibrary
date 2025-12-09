pipeline {
    agent any

    environment {
        // This ensures the frontend tests run once and exit, rather than watching for changes
        CI = 'true' 
    }

    stages {
        // --- BACKEND STAGES ---
        stage('Backend: Setup & Install') {
            steps {
                dir('djangotutorial') {
                    // Create a virtual environment to avoid permission issues
                    sh 'python3 -m venv venv'
                    // Install dependencies inside the venv
                    sh '. venv/bin/activate && pip install -r requirements.txt'
                }
            }
        }

        stage('Backend: Run Unit Tests') {
            steps {
                dir('djangotutorial') {
                    script {
                        try {
                            // Run the Django tests
                            sh '. venv/bin/activate && python manage.py test'
                        } catch (err) {
                            echo 'Backend tests failed!'
                            throw err
                        }
                    }
                }
            }
        }

        // --- FRONTEND STAGES ---
        stage('Frontend: Install Dependencies') {
            steps {
                dir('library-frontend') {
                    // Install Node modules
                    sh 'npm install'
                }
            }
        }

        stage('Frontend: Build & Test') {
            steps {
                dir('library-frontend') {
                    // Run tests (passWithNoTests ensures it doesn't fail if you haven't written JS tests yet)
                    sh 'npm test -- --passWithNoTests'
                    
                    // Create the production build
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            // Clean up the workspace after the job finishes to save space
            cleanWs()
        }
        success {
            echo 'Build and Tests Passed Successfully!'
        }
        failure {
            echo 'Build Failed. Please check the logs.'
        }
    }
}