host=slotoprizes.tagadagames.com
git ca ..
git push
ssh $host 'cd /prg/portal ; git pull ; quasar build'
ssh $host 'ln -s /var/www/html/public/assets/web_build_live /var/www/html/portal'
echo Listo
