pipeline {
    agent any

    environment {
        CI = 'true'
        // FIX: Add standard Mac paths so Jenkins can find 'npm'
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {
        stage('Backend: Setup & Install') {
            steps {
                sh 'python3 -m venv venv'
                sh '. venv/bin/activate && pip install -r djangotutorial/requirements.txt'
            }
        }

        stage('Backend: Run Unit Tests') {
            steps {
                script {
                    try {
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
                    // Jenkins should now find npm because of the PATH above
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