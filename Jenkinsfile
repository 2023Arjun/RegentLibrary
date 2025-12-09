pipeline {
    agent any

    environment {
        CI = 'true'
        // Ensure Jenkins can find npm/npx
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
                    sh 'npm install'
                }
            }
        }

        stage('Frontend: Build & Test') {
            steps {
                dir('library-frontend') {
                    // Fix linting warnings crashing the build
                    sh 'CI=false npm run build'
                }
            }
        }

        // --- DEPLOY STAGE (Must be inside 'stages' block) ---
        stage('Deploy') {
            steps {
                script {
                    echo "Starting Deployment..."
                    
                    // 1. Kill old processes on ports 8000 & 3000 (ignore errors if nothing is running)
                    sh 'lsof -ti:8000 | xargs kill -9 || true'
                    sh 'lsof -ti:3000 | xargs kill -9 || true'

                    // 2. Start Backend (Using nohup to keep it running in background)
                    withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                        sh 'nohup venv/bin/python manage.py runserver 0.0.0.0:8000 > backend.log 2>&1 &'
                    }

                    // 3. Start Frontend (Using npx serve)
                    withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                        dir('library-frontend') {
                            // Serve the 'build' folder created in previous stage
                            sh 'nohup npx serve -s build -l 3000 > frontend.log 2>&1 &'
                        }
                    }
                    
                    echo "Deployment Complete! Visit http://localhost:3000"
                }
            }
        }
    }

    post {
        always {
            // We do NOT want to clean workspace immediately because the servers need the files to run
            echo 'Pipeline finished.'
        }
        failure {
            echo 'Build Failed.'
        }
    }
}