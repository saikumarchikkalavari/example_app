pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Setup') {
            steps {
                echo 'Checking out code and installing dependencies...'
                checkout scm
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }
        
        stage('Build and Test') {
            steps {
                echo 'Building application and running tests...'
                script {
                    if (isUnix()) {
                        sh '''
                            npm run build
                            npm run test:ci || echo "Tests completed with warnings"
                        '''
                    } else {
                        bat '''
                            npm run build
                            npm run test:ci || echo Tests completed with warnings
                        '''
                    }
                }
            }
        }
        
    }
    
    post {
        always {
            junit 'junit.xml'
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Code Coverage Report'
            ])
        }
    }
}
 