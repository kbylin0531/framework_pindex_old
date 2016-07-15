<?php
/**
 * Created by PhpStorm.
 * User: lnzhv
 * Date: 7/14/16
 * Time: 2:34 PM
 */

namespace Application\Admin\Controller;
use Application\System\Library\LoginService;
use PLite\Debugger;
use PLite\Library\Controller;

/**
 * Class UserController 用户控制器
 * @package Application\Home\Controller
 */
class User extends Controller {

    public function login($username='',$password=''){
        if(IS_METHOD_POST){
            if(!$username or !$password){
                $this->redirect('/Admin/User/login#'.urlencode('用户名或者密码不能为空'));
            }
            $result = LoginService::getInstance()->login($username,$password);
            Debugger::trace($result);
            if(true !== $result){
                $this->redirect('/Admin/User/login#'.urlencode($result));
            }else{
                $this->redirect('/Admin/Index/index');
            }
            exit();
        }
        $this->display();
    }



    /**
     * 注销登录
     */
    public function logout(){
        LoginService::getInstance()->logout();
        $this->redirect('/System/Member/Public/login');
    }


}