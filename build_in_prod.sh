host=slotoprizes.tagadagames.com
git ca ..
git push
ssh $host 'cd /prg/portal ; git pull ; quasar build'
echo Listo
