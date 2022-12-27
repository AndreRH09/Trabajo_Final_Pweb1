#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;

my $q = CGI->new;
print $q->header('text/xml');

my $usuario = $q->param('usuario');
my $password = $q->param('password');
my $nombres = $q->param('nombres');
my $apellidos = $q->param('apellidos');
my $banco = $q->param('banco');
my $tarjeta = $q->param('tarjeta');
my $direccion = $q->param('direccion');


if(defined($usuario) && defined($password) && defined($nombres) && defined($apellidos) && defined($banco) && defined($tarjeta) && defined($direccion) && checkUser($usuario)){
  print renderXML();
}else{
  insertaBD($usuario, $password, $nombres, $apellidos,$banco,$tarjeta,$direccion);
  my $cuerpoXML= renderBody($usuario, $nombres, $apellidos);
  print renderXML($cuerpoXML);
}
sub checkUser{
  my $usuario = $_[0];
                  
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
              
  my $sql = "SELECT * FROM cliente WHERE userName=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($usuario);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
}
sub insertaBD{
  my $user = 'alumno';
  my $password = 'pweb1';
  my $userName = $_[0];
  my $pwd = $_[1];
  my $fn = $_[2];
  my $ln = $_[3];
  my $banco=$_[4];
  my $tarjeta=$_[5];
  my $direccion=$_[6];
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  my $sql = "INSERT INTO cliente(userName,password,firstName,lastName,banco,tarjeta,direccion)VALUES(?,?,?,?,?,?,?)";
  my $sth = $dbh->prepare($sql);
  $sth->execute($userName,$pwd,$fn,$ln,$banco,$tarjeta,$direccion);
  $sth->finish;
  $dbh->disconnect;
}

sub renderBody{
  my $userName = $_[0];
  my $fn = $_[1];
  my $ln = $_[2];
  my $cuerpo = <<"BODY";
    <owner>$userName</owner>
    <firstName>$fn</firstName>
    <lastName>$ln</lastName>
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
    <user>
      $cuerpo
    </user>
XML
return $xml
}
