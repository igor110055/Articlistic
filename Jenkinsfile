pipeline {
     agent any

    environment {
        PORT="3000"
        HOST="0.0.0.0"
        NODE_OPTIONS="--openssl-legacy-provider"
    }

    stages {
        stage("Build") {
            steps {
                sh '''
                node --version || true
                sudo node --version || true
                pwd
                cd Frontend/
                sudo rm -rf node_modules/
                sudo /home/ec2-user/.nvm/versions/node/v17.3.0/bin/npm install --legacy-peer-deps
                sudo /home/ec2-user/.nvm/versions/node/v17.3.0/bin/npm run build
                cd ../backend/
                pwd
                sudo rm -rf node_modules/
                sudo /home/ec2-user/.nvm/versions/node/v17.3.0/bin/npm install
                '''
            }
        }
        stage("Deploy") {
            steps {
                sh 'sudo fuser -k 3000/tcp || true'
                sh 'sudo fuser -k 3001/tcp || true'
                sh '''
                cd backend/
                sudo nohup /home/ec2-user/.nvm/versions/node/v17.3.0/bin/node src/api/index.js &
                cd ../Frontend/
                sudo /home/ec2-user/.nvm/versions/node/v17.3.0/bin/serve -s build -l 3001 &
                '''
            }
        }
        stage("Logs"){
            steps{
                sh '''
                ps -ef | grep node
                echo 'are all things good?'
                '''
            }
        }
    }
}