<?php


include('includes/api.php');
include('includes/functions.php');

$api = new api();


header("Content-type: application/json");
echo prettyPrint(json_encode($api->{$_GET['m']}()));


