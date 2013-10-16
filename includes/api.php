<?php
/**
 * Class api
 *
 * @property Redis $redis
 */
class api
{
    public $redis;

    private $types = array(
        0 => 'not found',
        1 => 'string',
        2 => 'set',
        3 => 'list',
        4 => 'zset',
        5 => 'hash'
    );

    public function __construct()
    {
        $this->redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
        $this->redis->select(0);
    }

    public function tree()
    {
        $response = array('label' => 'root');

        $keys = $this->redis->keys('slotty:*');


        foreach ($keys as $key) {
            $subkeys = explode(':', $key);

            $d = & $response;

            $fullpath = '';
            foreach ($subkeys as $key => $value) {
                if ($fullpath)
                    $fullpath .= ':' . $value;
                else
                    $fullpath = $value;

                if (!isset($d['children'][$value])) {
                    $d['children'][$value] = array('fullpath' => $fullpath, 'label' => $value);
                }
                $d = & $d['children'][$value];
            }

        }


        $response = $this->treeToArray($response);

        //return $response;
        return array_values($response['children']);
    }

    function treeToArray($data)
    {

        if (isset($data['children'])) {
            foreach ($data['children'] as $key => $value)
                $data['children'][$key] = $this->treeToArray($value);
            $data['children'] = array_values($data['children']);
        }


        return $data;
    }

    function load()
    {
        $key = $_POST['key'];
        $response = array(
            'key' => $key,
            'exists' => false
        );

        if (!$this->redis->exists($key))
            return $response;

        $response['type'] = $this->types[$this->redis->type($key)];
        //$response['data'] = 'trololo';
        $response['ttl'] = $this->redis->ttl($key);

        switch ($response['type']) {
            case 'string':
            {
                $response['value'] = $this->redis->get($key);
                $response['size'] = strlen($response['value']);
                $u = unserialize($response['value']);
                $response['data'] = $response['value'];
                if ($u !== false) {
                    $u['trololo'] = rand(0, 100);
                    $response[data] = '<pre>' . print_r($u, true) . '</pre>';
                }


                break;
            }
            case 'hash':
            {
                $response['value'] = $this->redis->hGetAll($key);
                $response['size'] = count($response['value']);
                break;
            }
            case 'list':
            {
                $response['size'] = $this->redis->lLen($key);
                break;
            }
            case 'set':
            {
                $response['value'] = $this->redis->sMembers($key);
                $response['size'] = count($response['value']);
                break;
            }
            case 'zset':
            {
                $response['value'] = $this->redis->zRange($key, 0, -1);
                $response['size'] = count($response['value']);
                break;
            }
        }

        return $response;
    }

}