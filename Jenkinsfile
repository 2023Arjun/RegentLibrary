pipeline {
    agent any

    environment {
        CI = 'true' 
    }

    stages {
        stage('Backend: Setup & Install') {
            steps {
                sh 'python3 -m venv venv'
                // Requirements are in the subfolder
                sh '. venv/bin/activate && pip install -r djangotutorial/requirements.txt'
            }
        }

        stage('Backend: Run Unit Tests') {
            steps {
                script {
                    try {
                        // manage.py is in the ROOT folder
                        sh '. venv/bin/activate && python manage.py test'
                    } catch (err) {
                        echo 'Backend tests failed!'
                        throw err
                    }
                }
            }
        }

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