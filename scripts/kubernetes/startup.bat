
echo iniciando statup

echo Criando os secrets 
kubectl apply -f secret.yaml

echo Criando os cronjobs
kubectl apply -f cronjob.yaml

echo Criando os services
kubectl apply -f service.yaml

echo Criando o ingress
kubectl apply -f ingress.yaml

echo Criando os deployments
kubectl apply -f deployment.yaml