<?php
/**
 * Created by PhpStorm.
 * User: lnzhv
 * Date: 7/14/16
 * Time: 2:34 PM
 */

namespace Application\Admin\Controller;
use PLite\Library\Controller;

/**
 * Class UserController 用户控制器
 * @package Application\Home\Controller
 */
class User extends Controller {

    public function login(){
        $this->display();
    }

    public function register(){
        $this->show();
    }

    /**
     * 修改密码
     */
    public function profile(){
        $this->show();
    }

    /**
     * 微信绑定登录
     */
    public function bindLogin(){
        $this->show();
    }
    /**
     * XXX
     */
    public function simpleLogin(){
        $this->show();
    }

    public function verify(){
        Verify::getInstance()->entry();
    }

}