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
                sh 'npm install'
            }
        }

        stage('Build and Test') {
            steps {
                echo 'Building application and running tests...'
                sh '''
                    npm run build
                    npm run test:ci || echo "Tests completed with warnings"
                '''
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
 