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


stage('Deploy') {
            steps {
                script {
                    // 1. Kill any existing servers on ports 8000/3000 to prevent conflicts
                    sh 'lsof -ti:8000 | xargs kill -9 || true'
                    sh 'lsof -ti:3000 | xargs kill -9 || true'

                    // 2. Start Backend in Background
                    // JENKINS_NODE_COOKIE=dontKillMe tells Jenkins "Leave this running after you finish"
                    withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                        sh 'nohup venv/bin/python manage.py runserver 0.0.0.0:8000 > backend.log 2>&1 &'
                    }

                    // 3. Start Frontend in Background
                    withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                        dir('library-frontend') {
                            // We use 'npx serve' to serve the build folder
                            sh 'nohup npx serve -s build -l 3000 > frontend.log 2>&1 &'
                        }
                    }
                    
                    echo "Deployment Successful! Access at http://localhost:3000"
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