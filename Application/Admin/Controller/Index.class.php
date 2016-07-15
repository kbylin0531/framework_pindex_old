<?php
/**
 * Created by PhpStorm.
 * User: lnzhv
 * Date: 7/14/16
 * Time: 4:54 PM
 */
namespace Application\Admin\Controller;
use Application\System\Library\Service\MenuService;
use PLite\Debugger;

class Index extends Admin{

    public function index(){
//        $this->assign('title','后台管理系统');
        $this->show();
    }

    public function main(){
        $this->show();
    }

    public function top(){
        Debugger::closeTrace();
        $this->show();
    }

    public function left(){
        $this->assign('sidemenu',(new MenuService())->getSideMenu());
        Debugger::closeTrace();
        $this->show();
    }




}