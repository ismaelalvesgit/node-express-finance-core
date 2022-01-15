
echo desativando statup


echo Desativando os services 
kubectl delete -f service.yml

echo Desativando os deployments 
kubectl delete -f deployment.yml --force --grace-period=0

echo Desativando os secrets 
kubectl delete -f secret.yml