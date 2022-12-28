#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;

my $q = CGI->new;
print $q->header('text/xml');
my $nombre=$q->param('nombre');
my $marca=$q->param('marca');

if(searchBD($nombre,$marca)){
  deleteCarrito($nombre,$marca);
  my $cuerpoXML=obtener();
  print renderXML($cuerpoXML);
}else{
  my $cuerpoXML=obtener();
  print renderXML();
}
sub deleteCarrito{
  my $nombre=$_[0];
  my $marca=$_[1];
  my $user = 'alumno';
  my $password = 'pweb1';
  my $body = "";
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "DELETE FROM carrito where nombre=? and marca=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($nombre,$marca);
  $sth->finish;
  $dbh->disconnect;
}
  sub obtener{
  my $user = 'alumno';
  my $password = 'pweb1';
  my $body = "";
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "SELECT * FROM carrito";
  my $sth = $dbh->prepare($sql);
  $sth->execute();
  while(my @row=$sth->fetchrow_array){
    $body.=renderBody(@row);
  }
  $sth->finish;
  $dbh->disconnect;
  return $body;
  
}


sub searchBD{
  my $nombre=$_[0];
  my $marca=$_[1];
  my $user = 'alumno';
  my $password = 'pweb1';

  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "SELECT * FROM carrito where nombre=? and marca=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($nombre,$marca);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
}

sub renderBody{
  my $nombre = $_[0];
  my $modelo = $_[1];
  my $precio = $_[2];
  my $marca = $_[3];
  my $codigo = $_[4];
  my $cuerpo = <<"BODY";
    <producto>
      <nombre>$nombre</nombre>
      <modelo>$modelo</modelo>
      <precio>$precio</precio>
      <marca>$marca</marca>
      <codigo>$codigo</codigo>
    </producto>
BODY
  return $cuerpo;
}

sub renderXML{
  my $cuerpo = "";
  if(defined($_[0])){
    $cuerpo .= $_[0];
  }
    my $xml = <<"XML";
<?xml version='1.0' encoding= 'utf-8'?>
    <productos>
      $cuerpo
    </productos>
XML
return $xml
}
