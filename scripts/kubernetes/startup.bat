
echo iniciando statup

echo Criando os secrets 
kubectl apply -f secret.yml

echo Criando os services
kubectl apply -f service.yml

echo Criando os deployments
kubectl apply -f deployment.yml