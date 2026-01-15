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
                sh 'npm run build'
                sh 'npm run test:ci'
            }
        }
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'junit.xml'
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Code Coverage Report'
            ])
        }
    }
}
 