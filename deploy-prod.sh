host=slotoprizes.tagadagames.com
chmod 755 dist -R
rm -f dist.bz2
echo compress
tar --create --bzip --verbose --file dist.bz2 dist/spa/
# > /dev/null 2>&1
echo scp
scp dist.bz2 $host:/tmp
ssh $host 'rm -rf /prg/portal/dist/* ; tar -jxvf /tmp/dist.bz2 -C /prg/portal > /dev/null 2>&1 ; chmod 755 /prg/portal/dist -R'
ssh $host 'ln -s /var/www/html/public/assets/web_build_live /var/www/html/portal'
rm -f dist.bz2
echo Listo
