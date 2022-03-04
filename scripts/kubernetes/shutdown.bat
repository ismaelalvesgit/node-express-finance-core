
echo desativando statup

echo Desativando os services 
kubectl delete -f service.yaml

echo Desativando os cronjobs
kubectl delete -f cronjob.yaml --force --grace-period=0

echo Desativando os deployments 
kubectl delete -f deployment.yaml --force --grace-period=0

echo Desativando os secrets 
kubectl delete -f secret.yaml