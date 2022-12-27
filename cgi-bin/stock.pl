#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;

my $q = CGI->new;
print $q->header('text/xml');
my $nombre=$q->param('nombre');
my $marca=$q->param('marca');
my $stock=$q->param('stock');

if(checkOwner($nombre,$marca)){
  updateStock($nombre,$marca,$stock);
  my $cuerpoXML = searchBD($nombre,$marca);
  print renderXML($cuerpoXML);
}else{
  print renderXML();
}
sub updateStock{
  my $nombre=$_[0];
  my $marca=$_[1];
  my $stock=$_[2];
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "UPDATE inventario set stock=? where nombre=? and marca=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($stock,$nombre,$marca);
  $sth->finish;
  $dbh->disconnect;
}
sub checkOwner{
  my $nombre=$_[0];
  my $marca=$_[1];
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "SELECT * FROM inventario where nombre=? and marca=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($nombre,$marca);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
}
sub searchBD{
  my $nombre=$_[0];
  my $marca=$_[1];
  my $user = 'alumno';
  my $password = 'pweb1';
  my $body = "";
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "SELECT * FROM inventario where nombre=? and marca=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($nombre,$marca);
  while(my @row = $sth->fetchrow_array){
    $body .= renderBody(@row);
  }
  $sth->finish;
  $dbh->disconnect;
  return $body;
}

sub renderBody{
  my $nombre = $_[0];
  my $stock = $_[1];
  my $modelo = $_[2];
  my $precio = $_[3];
  my $marca = $_[4];
  my $codigo = $_[5];
  my $cuerpo = <<"BODY";
    <producto>
      <nombre>$nombre</nombre>
      <stock>$stock</stock>
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
