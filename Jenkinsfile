pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // Configure this in Jenkins Global Tool Configuration
    }
    
    environment {
        SAMPLEBUNDLE_REPO = 'https://github.com/saikumarchikkalavari/samplebundle.git'
        SAMPLEBUNDLE_BRANCH = 'main' // Change if needed
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out example_app repository...'
                checkout scm
            }
        }
        
        stage('Clone Sample Bundle') {
            steps {
                echo 'Cloning samplebundle repository...'
                script {
                    dir('samplebundle') {
                        git branch: "${SAMPLEBUNDLE_BRANCH}", 
                            url: "${SAMPLEBUNDLE_REPO}"
                    }
                }
            }
        }
        
        stage('Install Dependencies from Sample Bundle') {
            steps {
                echo 'Installing packages from samplebundle...'
                script {
                    dir('samplebundle') {
                        sh 'npm install'
                        sh 'npm link' // Creates global link
                    }
                }
            }
        }
        
        stage('Install Example App Dependencies') {
            steps {
                echo 'Installing example_app dependencies...'
                sh 'npm install'
                
                // Link samplebundle if it's a dependency
                script {
                    sh 'npm link samplebundle || echo "samplebundle not needed as linked dependency"'
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm run build'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running test cases...'
                sh 'npm test'
            }
        }
        
        stage('Code Quality Check') {
            steps {
                echo 'Running linting...'
                script {
                    sh 'npm run lint || echo "Linting step optional"'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            // Archive build artifacts if needed
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
        }
        
        failure {
            echo 'Pipeline failed!'
            // Send notifications, etc.
        }
        
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
 